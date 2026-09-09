import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ColorBlob } from '../../../../utils/ColorBlob.tsx';
import { getColor } from '../../../../utils/colorUtil.ts';
import { formatTimeOnly } from '../../../../utils/dateUtil.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';

interface TrackArrival {
    id: string;
    name: string;
    color: string;
    priority?: number;
}

interface ArrivalGroup {
    time: string;
    sortTime: number;
    tracks: TrackArrival[];
}

export const PlannerSidebarOverviewTrackArrivals = () => {
    const trackInfos = useSelector(getTrackStreetInfos);
    const tracks = useSelector(getTrackCompositions);
    const tracksById = new Map(tracks.map((track) => [track.id, track]));
    const hasPriorities = tracks.some((track) => track.priority !== undefined);

    const groups = new Map<string, ArrivalGroup>();
    trackInfos.forEach((trackInfo) => {
        const track = tracksById.get(trackInfo.id);
        if (!track) return;

        const time = formatTimeOnly(trackInfo.arrivalFront, true);
        const existingGroup = groups.get(time);
        const arrival: TrackArrival = {
            id: track.id,
            name: track.name || '---',
            color: getColor(track),
            priority: track.priority,
        };
        if (existingGroup) {
            existingGroup.tracks.push(arrival);
        } else {
            groups.set(time, {
                time,
                sortTime: new Date(trackInfo.arrivalFront).getTime(),
                tracks: [arrival],
            });
        }
    });

    const arrivalGroups = [...groups.values()]
        .sort((first, second) => first.sortTime - second.sortTime)
        .map((group) => ({
            ...group,
            tracks: hasPriorities
                ? [...group.tracks].sort(
                      (first, second) =>
                          (second.priority ?? Number.NEGATIVE_INFINITY) - (first.priority ?? Number.NEGATIVE_INFINITY)
                  )
                : group.tracks,
        }));

    return (
        <Table striped bordered size="sm">
            <thead>
                <tr>
                    <th>
                        <FormattedMessage id="msg.arrival" />
                    </th>
                    <th>
                        <FormattedMessage id="msg.tracks" />
                    </th>
                </tr>
            </thead>
            <tbody>
                {arrivalGroups.map((group) => (
                    <tr key={group.time}>
                        <td>{group.time}</td>
                        <td>
                            {hasPriorities
                                ? group.tracks
                                      .reduce<TrackArrival[][]>((lines, track) => {
                                          const lastLine = lines[lines.length - 1];
                                          if (lastLine && lastLine[0]?.priority === track.priority) {
                                              lastLine.push(track);
                                          } else {
                                              lines.push([track]);
                                          }
                                          return lines;
                                      }, [])
                                      .map((line, lineIndex) => (
                                          <div key={`${group.time}-${lineIndex}`}>
                                              {line.map((track) => (
                                                  <span key={track.id}>
                                                      <ColorBlob color={track.color} />
                                                      {track.name}
                                                  </span>
                                              ))}
                                          </div>
                                      ))
                                : group.tracks.map((track) => (
                                      <span key={track.id}>
                                          <ColorBlob color={track.color} />
                                          {track.name}
                                      </span>
                                  ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
