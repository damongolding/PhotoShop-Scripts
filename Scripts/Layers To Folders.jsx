/**
 *
 * @author Damon Golding
 * @version 0.1
 * @description Grabs all layers and puts them into thier own folder with the same name as the layer
 *
 */


/**
 * Grabs selected/active layers ID's
 * @return {[array]}
 */
function getSelectedLayersIdx() {
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        var c = desc.count
        var selectedLayers = new Array();
        for (var i = 0; i < c; i++) {
            try {
                docRef.backgroundLayer;
                selectedLayers.push(desc.getReference(i).getIndex());
            } catch (e) {
                selectedLayers.push(desc.getReference(i).getIndex() + 1);
            }
        }
    } else {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        try {
            docRef.backgroundLayer;
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
        } catch (e) {
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
        }
    }
    return selectedLayers;
}

/**
 * Makes layes selected/active via their ID's
 * @param  {[string,array]} idx     [Items to be make actives ID]
 * @param  {[bool]} visible []
 */
function makeActiveByIndex(idx, visible) {
    for (var i = 0; i < idx.length; i++) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), idx[i])
        desc.putReference(charIDToTypeID("null"), ref);
        if (i > 0) {
            var idselectionModifier = stringIDToTypeID("selectionModifier");
            var idselectionModifierType = stringIDToTypeID("selectionModifierType");
            var idaddToSelection = stringIDToTypeID("addToSelection");
            desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
        }
        desc.putBoolean(charIDToTypeID("MkVs"), visible);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }
}

/**
 * Convert IDs into names so when we create new folder/layers it PS wont get confused
 * @param  {[array]} layerID [array of IDs']
 * @return {[array]}
 */
function getSelectedLayersNames(layerID) {
    var selectedLayersNames = [];

    for (var i = layerID.length - 1; i >= 0; i--) {

        // Make current item in layerName array active/selected
        makeActiveByIndex([layerID[i]], true);
        selectedLayersNames.push(app.activeDocument.activeLayer.name);
    };

    return selectedLayersNames;
}

/**
 * Make Layer active/selected via name supplied
 * @param  {[string]} nm [Name of layer to be made active]
 */
function makeLayerActiveByName(nm) {
    function cTID(s) {
        return app.charIDToTypeID(s);
    };

    try {
        var desc5 = new ActionDescriptor();
        var ref4 = new ActionReference();
        ref4.putName(cTID('Lyr '), nm);
        desc5.putReference(cTID('null'), ref4);
        desc5.putBoolean(cTID('MkVs'), false);
        executeAction(cTID('slct'), desc5, DialogModes.NO);
        return true;

    } catch (e) {
        return false;
    }
};

/**
 * Create folders from Layers
 */
function createFolders() {

    // Grabs all selected layers ID's
    var selectedLayersIDs = getSelectedLayersIdx();
    var selectedLayersNames = getSelectedLayersNames(selectedLayersIDs);

    // Loop through layerName array
    for (var i = 0; i < selectedLayersNames.length; i++) {

        makeLayerActiveByName(selectedLayersNames[i]);

        //Current active layer
        var currentLayer = app.activeDocument.activeLayer;

        // Create new group
        var newGroup = app.activeDocument.layerSets.add();
        // Rename new group to the name of the current layer
        newGroup.name = selectedLayersNames[i];

        $.writeln(i + " Name: " + currentLayer.name);

        // Move active layer into the new folder
        currentLayer.move(newGroup, ElementPlacement.INSIDE);

    };
}

createFolders();