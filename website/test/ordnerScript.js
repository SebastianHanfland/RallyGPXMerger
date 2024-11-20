const title = 'Routenzuteilung für die Sternfahrt 2024';
const formName = 'Routenzuteilung 2024';

const description = `Liebe Radlfreunde, 
bald ist es wieder soweit. Am 21. April möchten wir möglichst viele Radbegeisterte in großen Radzügen aus allen Himmelsrichtungen in die Münchner Innenstadt bringen.
Bis dahin suchen wir noch weitere Ordner:innen. 
Solltet ihr zu Beginn des Jahres bereits eine ähnliche Umfrage ausgefüllt habt, ist es euch freigestellt, ob ihr diese Umfrage erneut ausfüllt. 
Eine Übersicht zur Sternfahrt ist hier zu finden: https://muenchen.adfc.de/sternfahrt

In dieser Umfrage werden wir Folgendes abfragen:
* Wunschroute
* Alternativrouten
* Sonstige Aufgaben

Die Angabe von erwägbaren Alternativen ist angedacht, damit einzelne Routen nicht "ungeordnet" ausgehen. Grundsätzlich versuchen wir aber, die Wunschroute zu ermöglichen.
Zeitnah erhaltet ihr dann eine Email mit weiteren Informationen, u.A. zur Ordnerschulung, zum Startpunkt und zur finalen Startzeit. Haltet euch bis dahin gerne über die Website auf dem aktuellen Stand.`;

const tracks = [
    'A1: Augsburg',
    'A2: Starnberg',
    'A3: Rosenheim',
    'A4: ',
    'A5: ',
    'A6: ',
    'A7: ',
    'A8: ',
    'A9: ',
    'A10: ',
    'M1: ',
    'M2: ',
    'M3: ',
    'M4: ',
];

const assignmentSheetName = 'Zuteilung';
const evaluationSheetName = 'Auswertung';
const emailSheetName = 'Email Verteiler';

function addDataProtection(form) {
    var section = form.addPageBreakItem();
    section.setTitle('Einverständniserklärung zur Datenverarbeitung');
    form.addCheckboxItem()
        .setTitle(
            'Ich bin damit einverstanden, dass meine Daten zur Vorbereitung und Durchführung der Sternfahrt im April 2024 mit Google Forms gespeichert werden. Danach werden die Daten gelöscht.'
        )
        .setChoiceValues(['Ja'])
        .setRequired(true);
}

function addFavoriteTrackQuestion(form) {
    const section = form.addPageBreakItem();
    section.setTitle('Wunschroute');
    section.setHelpText(`Routen auf Google Maps

Wir versuchen dir die Teilnahme in deiner Wunschroute zu ermöglichen.
Bitte wähle dafür deine Wunschroute aus:
(Bei den längeren Strecken ist ein Hinzustoßen kein Problem. Ab dem nächstmöglichen Pausenort werden wir dich bei Bedarf mit dem nötigen Equipment ausstatten. Den entsprechenden nächstmöglichen Pausenort fragen wir dich deshalb in den nächsten Fragen ebenfalls ab. Über die entsprechenden Zeiten informieren wir nochmal per Mail nach der Zuordnung)`);

    form.addMultipleChoiceItem().setTitle('Wunschroute').setChoiceValues(tracks);
}

function addAlternativeTrackQuestion(form) {
    const section = form.addPageBreakItem();
    section.setTitle('Alternativrouten');
    section.setHelpText(
        `Da wir dir in seltenen Fällen nicht deine Wunschroute zuteilen können, ist es für uns bei der Organisation hilfreich, wenn du uns mitteilst, an welchen alternativen Routen du teilnehmen könntest.`
    );

    form.addCheckboxItem().setTitle('Alternativrouten').setChoiceValues(tracks);
}

function addOtherSupportQuestion(form) {
    const otherSupport = [
        'Spendensammeln am Königsplatz',
        'Vor der SF Material zu meinem Startpunkt transportieren',
        'Nach der SF Material vom Königsplatz zum Radlerhaus transportieren',
        'Erste-Hilfe-Set mitnehmen',
        'Vor der SF Material zum Königplatz transportieren',
    ];

    const section = form.addPageBreakItem();
    section.setTitle('Sonstige Aufgaben');
    form.addCheckboxItem()
        .setTitle('Neben den Ordneraufgaben kann ich auch noch folgende Aufgaben übernehmen:')
        .setChoiceValues(otherSupport);
}

function addEvaluationToSpreadSheet(sheet) {
    sheet.insertSheet(evaluationSheetName);

    const evaluation = sheet.getSheetByName(evaluationSheetName);
    evaluation.getRange(`A1`).setValue('Route');
    evaluation.getRange(`B1`).setValue('Anzahl');
    evaluation.getRange(`C1`).setValue('Zielanzahl');
    tracks.forEach((track, index) => {
        evaluation.getRange(`A${index + 2}`).setValue(track.split(':')[0]);
        evaluation
            .getRange(`B${index + 2}`)
            .setFormula(`=COUNTIF('${assignmentSheetName}'!E2:E${limit}, A${index + 2})`);
    });
}

function addEmailCsvToSpreadSheet(sheet) {
    sheet.insertSheet(emailSheetName);
    const emailSheet = sheet.getSheetByName(emailSheetName);

    emailSheet.getRange('A1').setValue('csv');
    emailSheet.getRange('A2').setFormula(`=CONCATENATE('${assignmentSheetName}'!G1:G${limit})`);
}

const limit = 300;

function setFormulaRange(assigments, rangeTarget, formulaTarget) {
    for (let i = 2; i < limit; i++) {
        assigments.getRange(`${rangeTarget}${i}`).setFormula(`=INDIRECT("'Form Responses 1'!${formulaTarget}${i}")`);
    }
}

function setAlternativeRouteFormula(assigments, rangeTarget, formulaTarget, extraSpace = false) {
    for (let i = 2; i < limit; i++) {
        assigments
            .getRange(`${rangeTarget}${i}`)
            .setFormula(createAlternativeRouteFormula(formulaTarget, i, extraSpace));
    }
}

function createAlternativeRouteFormula(formulaTarget, i, extraSpace) {
    return `=CONCATENATE(${tracks
        .map((track) => {
            return `IF(REGEXMATCH(INDIRECT("'Form Responses 1'!${formulaTarget}${i}"); "${
                track.split(':')[0] + ':'
            }");"${track.split(':')[0]}${extraSpace ? ' ' : ''}";"");`;
        })
        .join('')})`;
}

function addAndHideColumnsForCSVExport(assignmentSheet) {
    assignmentSheet.getRange('G1').setFormula('=CONCATENATE("E-mail Address;";"Categories;")&CHAR(10)');
    assignmentSheet
        .getRange('G2:G1000')
        .setFormulaR1C1('=IF(R[0]C[-6] <> "";CONCATENATE(R[0]C[-6];";";R[0]C[-2];";")&CHAR(10); "")');
    assignmentSheet.hideColumns(7, 1);
}

function addAssigmentToSpreadSheet(sheet) {
    sheet.insertSheet(assignmentSheetName);

    const assigments = sheet.getSheetByName(assignmentSheetName);

    // Header
    assigments.getRange('A1').setValue('Email');
    assigments.getRange('B1').setValue('Wunschroute');
    assigments.getRange('C1').setValue('Alternativrouten');
    assigments.getRange('D1').setValue('Manuelle Route');
    assigments.getRange('E1').setValue('Zugeteilte Route');

    // Columns
    setFormulaRange(assigments, 'A', 'B');
    setAlternativeRouteFormula(assigments, 'B', 'D');
    setAlternativeRouteFormula(assigments, 'C', 'E', true);

    addAndHideColumnsForCSVExport(assigments);

    assigments.getRange('E2:E1000').setFormulaR1C1('=If(R[0]C[-1] <> ""; R[0]C[-1]; R[0]C[-3])');
}

function createForm() {
    const sheet = SpreadsheetApp.create(formName + ' Answers');

    const form = FormApp.create(formName)
        .setTitle(title)
        .setDescription(description)
        .setCollectEmail(true)
        .setRequireLogin(false)
        .setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

    addDataProtection(form);
    addFavoriteTrackQuestion(form);
    addAlternativeTrackQuestion(form);
    addOtherSupportQuestion(form);

    addAssigmentToSpreadSheet(sheet);
    addEvaluationToSpreadSheet(sheet);
    addEmailCsvToSpreadSheet(sheet);
}
