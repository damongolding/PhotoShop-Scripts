/**
 * @author Damon Golding
 * @version 0.1
 * @description Grabs selected layers and add given extentions
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
 * The Main dish
 */
function addExtention() {

    var extention = prompt('Add extention', '.png');
    // Grabs all selected layers ID's
    var selectedLayers = getSelectedLayersIdx();

    // Loop through elementNames array
    for (var i = 0; i < selectedLayers.length; i++) {

        // Make current item in layerName array active/selected
        makeActiveByIndex([selectedLayers[i]], false);

        //Current active layer
        var currentLayer = app.activeDocument.activeLayer;
        // Current layers name
        var currentLayerName = currentLayer.name;
        // The new name
        var newName = currentLayerName + extention;

        // Replace with new name
        currentLayer.name = newName;

    };
}

addExtention();