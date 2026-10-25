import { getBaseUrl } from '../../utils/linkUtil';

export interface PlanningLink {
    messageId: string;
    href: string;
}

interface PlanningLinkOptions {
    planningId: string;
    password?: string;
    hasEntryPoints: boolean;
}

export function getPlanningLinks({ planningId, password, hasEntryPoints }: PlanningLinkOptions): PlanningLink[] {
    const baseUrl = getBaseUrl();
    const displayLink = `${baseUrl}?display=${planningId}`;
    const tableLink = `${baseUrl}?table=${planningId}`;

    const links: PlanningLink[] = [
        { messageId: 'msg.publicLink', href: displayLink },
        { messageId: 'msg.publicTableLink', href: tableLink },
        { messageId: 'msg.publicTableLink.withIndex', href: `${tableLink}&rows=0,1,2` },
    ];

    if (hasEntryPoints) {
        links.push(
            { messageId: 'msg.publicLink.times.defaultOn', href: `${displayLink}&times=defaultOn` },
            { messageId: 'msg.publicLink.times.defaultOff', href: `${displayLink}&times=defaultOff` },
            { messageId: 'msg.publicLink.times.off', href: `${displayLink}&times=off` }
        );
    }

    links.push(
        { messageId: 'msg.planningLink', href: `${baseUrl}?section=gps&planning=${planningId}` },
        { messageId: 'msg.compareLink', href: `${baseUrl}?comparison=${planningId},<other-planning-id>` }
    );

    if (password) {
        links.push({
            messageId: 'msg.planningLinkWithAdmin',
            href: `${baseUrl}?section=gps&planning=${planningId}&admin=${password}`,
        });
    }

    return links;
}
