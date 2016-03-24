import './_resizer.scss';

let resizerComponent = ($document) => {
  let link = ($scope, $element, $attrs) => {
    $element.on('mousedown', function (event) {
      event.preventDefault();

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event, ui) {
      if ($attrs.calendarResizer == 'vertical') {
        // Todo: Implement function for calendar resize vertical if needed.
      } else {
        let targetElement = $($attrs.resizerTop);
        let targetOffsetTop = targetElement.offset().top;

        targetElement.css({
          height: (event.pageY - targetOffsetTop) + 'px'
        });
      }
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  };

  return {
    restrict: 'A',
    link,
  };
};

resizerComponent.$inject = ['$document'];

export default resizerComponent;
