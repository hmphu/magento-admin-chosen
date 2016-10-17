"use strict";
var _hmpAdminChosenInit = function(el) {
    if (el.readAttribute('disable-chosen') == 1) return;
    if (el.select('option').size() < 10) return;

    if (typeof el.chosenObj == 'object') {
        el.chosenObj.destroy();
        el.chosenObj = null;
    }
    var firstChild = el.firstDescendant();
    if (firstChild != null && firstChild.readAttribute('value') == '') {
        el.writeAttribute('data-placeholder', firstChild.text);
        firstChild.update(); // Clear out content of first option
    }
    el.chosenObj = new Chosen(el, {
        disable_search_threshold: 10,
        allow_single_deselect: true
    });
}

if (typeof Fieldset !== 'undefined') {
    Fieldset.applyCollapse = Fieldset.applyCollapse.wrap(function(parent, containerId) {
        parent(containerId);
        if ($(containerId).visible()) {
            $(containerId).select('select:not(name="limit")').each(function(el) {
                _hmpAdminChosenInit(el);
            });
        }
    });
}

if (typeof varienGlobalEvents !== 'undefined') {
    varienGlobalEvents.attachEventHandler('showTab', function(ev) {
        var tab = ev.tab;
        var tabContentEl = $(tab.identify() + '_content');
        if (tabContentEl) {
            tabContentEl.select('select:not(name="limit")').each(function(el) {
                _hmpAdminChosenInit(el);
            });
        }
    });
}

if (typeof toggleValueElements == 'function') {
    toggleValueElements = toggleValueElements.wrap(function(parent, checkbox, container, excludedElements, checked) {
        parent(checkbox, container, excludedElements, checked);
        if ($(container).select('.chosen-container').length) {
            $(container).select('select').each(function(el) {
                Event.fire(el, "chosen:updated");
            });
        }
    });
}

if (typeof varienGrid == 'function') {
    varienGrid.prototype.bindFilterFields = varienGrid.prototype.bindFilterFields.wrap(function(parent) {
        parent();
        var filters = $$('#' + this.containerId + ' .filter select');
        filters.each(function(select_el) {
            _hmpAdminChosenInit(select_el);
        });
    });
}