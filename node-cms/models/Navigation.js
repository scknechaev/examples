module.exports = {
    attributes: {
        name: {
            type: 'string'
        },
        navtype: {
            type: 'integer'
        },
        href: {
            type: 'string'
        },
        page: {
            model: 'page'
        },
        orientation: {
            type: 'integer'
        }
    }
};
/**
 * navtype 1 internal, 2 external
 * orientation, 1 horizontal, 2 vertical
 */
