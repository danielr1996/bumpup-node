let reNomatch = /(?!.*)/

function join (array, joiner) {
    return array
        .map(function (val) {
            return val.trim()
        })
        .filter(function (val) {
            return val.length
        })
        .join(joiner)
}

function getNotesRegex (noteKeywords) {
    if (!noteKeywords) {
        return reNomatch
    }

    return new RegExp('^[\\s|*]*(' + join(noteKeywords, '|') + ')[:\\s]+(.*)', 'i')
}

function getReferencePartsRegex (issuePrefixes, issuePrefixesCaseSensitive) {
    if (!issuePrefixes) {
        return reNomatch
    }

    let flags = issuePrefixesCaseSensitive ? 'g' : 'gi'
    return new RegExp('(?:.*?)??\\s*([\\w-\\.\\/]*?)??(' + join(issuePrefixes, '|') + ')([\\w-]*\\d+)', flags)
}

function getReferencesRegex (referenceActions) {
    if (!referenceActions) {
        // matches everything
        return /()(.+)/gi
    }

    let joinedKeywords = join(referenceActions, '|')
    return new RegExp('(' + joinedKeywords + ')(?:\\s+(.*?))(?=(?:' + joinedKeywords + ')|$)', 'gi')
}

export function regex(options):any {
    options = options || {}
    let reNotes = getNotesRegex(options.noteKeywords)
    let reReferenceParts = getReferencePartsRegex(options.issuePrefixes, options.issuePrefixesCaseSensitive)
    let reReferences = getReferencesRegex(options.referenceActions)

    return {
        notes: reNotes,
        referenceParts: reReferenceParts,
        references: reReferences,
        mentions: /@([\w-]+)/g
    }
}