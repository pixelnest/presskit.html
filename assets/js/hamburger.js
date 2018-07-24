'use strict'

;(function () {
  // Preamble: this code is very specific, and clearly made for then
  // main nav.
  // Currently, this functionality is not need elsewhere, so we didn't
  // bother to generalized this.
  // No guards too.

  // To disable this feature, just remove the script tag.

  window.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('#hamburger')
    var button = document.querySelector('#hamburger-toggle')
    var target = document.querySelector('#hamburger-target')

    // Show hamburger (hidden by default if no js or hamburger disabled).
    container.style.display = 'block'

    // Get target height.
    var baseHeight = getElementHeight(target)

    // Do that after the height calculation!
    target.className += ' nav__list--slider'

    button.addEventListener('click', function (e) {
      e.preventDefault()
      e.stopPropagation()

      var currentMaxHeight = parseInt(target.style.maxHeight, 10)

      // If not set or 0, toggle to full height.
      // Otherwise, hide.
      if (!currentMaxHeight || currentMaxHeight === 0) {
        target.style.cssText = 'max-height: ' + baseHeight + 'px'
      } else {
        target.style.cssText = 'max-height: 0px'
      }
    })
  })

  // Clone an element outside the screen to safely get its height, then destroy it.
  function getElementHeight (element) {
    var clone = element.cloneNode(true)
    clone.style.cssText = 'visibility: hidden; display: block; margin: -999px 0'

    var height = (element.parentNode.appendChild(clone)).clientHeight
    element.parentNode.removeChild(clone)

    return height
  }
})()
