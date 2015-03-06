/*
 * animation.js
 *
 * Handles all extra animations for the NEAT app.
 * It is not part of the NEAT app namespace because it doesn't require any
 * of it. It has its own namespace.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var animation = animation || {};

//A dict containing all spinners with keys being the containing element's id.
animation.spinners = {};

/*
 * createSpinner
 * Creates a spinner inside the given id
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
animation.createSpinner = function(id) {

    var elt = document.getElementById(id);

    if (animation.spinners[id] == undefined) {

        //Create a new spinner

        //based from code at http://fgnass.github.io/spin.js/
        var opts = {
          lines: 11,
          length: 11,
          width: 4,
          radius: 8,
          corners: 1,
          rotate: 0,
          direction: 1,
          color: '#000',
          speed: 1,
          trail: 60,
          shadow: false,
          hwaccel: false,
          className: 'spinner',
          zIndex: 2e9,
          top: '50%',
          left: '50%'
        };

        animation.spinners[id] = new Spinner(opts).spin(elt);

    } else {

        //Restart old spinner
        animation.spinners[id].spin(elt);
    }
}

/*
 * stopSpinners
 *
 * Stops and hides all spinners.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
animation.stopSpinners = function() {
    for (id in animation.spinners) {
        animation.spinners[id].stop();
    }
}

