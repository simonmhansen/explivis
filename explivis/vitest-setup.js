import '@testing-library/jest-dom'

global.document = global.document || {};
document.queryCommandSupported = () => false;


global.window = global.window || {};

// Mock `window.matchMedia`
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function () {}, // For older API support
      removeListener: function () {}, // For older API support
      addEventListener: function () {}, // For newer API support
      removeEventListener: function () {}, // For newer API support
      dispatchEvent: function () {},
    };
  };


vi.mock('monaco-editor', () => ({
editor: {
    create: vi.fn(),
    setModel: vi.fn(),
    dispose: vi.fn(),
},
}));