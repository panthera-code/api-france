function normalizeString(string) {

    const ligatures = {'æ': 'ae', 'Æ': 'Ae', 'œ': 'oe', 'Œ': 'Oe'}
    string = string.replace(/[æÆœŒ]/g, match => ligatures[match])

    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, (match, offset, string) => {
        return string[offset - 1].toUpperCase() === string[offset - 1] ? '' : match
    })

}

function arrayToString(array) {
    return array.sort().join(', ')
}

module.exports = { normalizeString, arrayToString }