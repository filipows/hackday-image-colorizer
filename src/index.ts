import { CanvaApiClient, ControlName } from "@canva/editing-extensions-api-typings";

const { imageHelpers } = window.canva;
const canva = window.canva.init();

console.log('HackDay Image Colorizer')

const state = {
  canvas: null,
  renderFactor: 35,
};

canva.onReady(async (opts) => {
  console.log('on ready', opts);
  const image = await imageHelpers.fromUrl(opts.element.data.preview.url);
  state.canvas = await imageHelpers.toCanvas(image);
  document.body.appendChild(state.canvas);
  renderControls();
});

canva.onControlsEvent(async (opts) => {
  console.log('on controls event', opts);
  if (opts.message.controlId === 'renderFactor') {
    state['renderFactor'] = opts.message.message['value'];

    if (opts.message.commit) {
      renderControls();
    }
  }
  else if (opts.message.controlId === 'startRemoteImageProcessing') {
    // Show the loading spinner
    canva.toggleSpinner('preview', true);

    const settings = {
      renderFactor: state['renderFactor']
    }
    // Remotely process the user's image
    console.log('starting remote process...')
    const result = await canva.remoteProcess({
      settings: JSON.stringify(settings)
    });
    console.log('result from remoteProcess', result)
    const image = await imageHelpers.fromUrl(result.previewImage.url);

    // Render the processed image
    const context = state.canvas.getContext('2d');
    const img = await imageHelpers.toImageElement(image);
    context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);

    // Hide the loading spinner
    canva.toggleSpinner('preview', false);
  }
});


canva.onImageUpdate(async (opts) => {
  console.log("on image update", opts);
  // Convert the updated image into an HTMLImageElement
  const img = await imageHelpers.toImageElement(opts.image); // we call .toImageElement as there's already created Canvas attached to the iFrame's DOM

  // Draw the updated image into the HTMLCanvasElement
  const context = state.canvas.getContext("2d");
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});

canva.onSaveRequest(async () => {
  // Save the user's image
  console.log("on save ");
  return await imageHelpers.fromCanvas("image/jpeg", state.canvas);
});


function renderControls() {
  const controls = [
    canva.create(ControlName.SLIDER, {
      id: 'renderFactor',
      label: 'Color Accuracy',
      value: state.renderFactor,
      min: 1,
      max: 35,
      step: 1,
    }),
    canva.create(ControlName.BUTTON, {
      id: 'startRemoteImageProcessing',
      label: 'Colorize your image',
    }),
  ];
  canva.updateControlPanel(controls);
  console.log('rendered controls')
}
