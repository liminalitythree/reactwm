var assert = require('chai').assert;
var sinon = require('sinon');
var Window = require('../../lib/models/window');

describe('window', function () {
  var window;

  beforeEach(function () {
    window = new Window({
      id: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      title: 'title'
    });
  });

  describe('move', function () {

    it('should move the window to a point', function () {
      var window = new Window({ id: 0 });
      assert.equal(window.x, 0);
      assert.equal(window.y, 0);

      window.startMove(0, 0);

      var x = 200;
      var y = 300;

      window.update(x, y);
      assert.equal(window.x, x);
      assert.equal(window.y, y);

      window.endChange();
    });

  });

  describe('._quadrant', function () {

    it('top left', function () {
      assert.deepEqual(window._quadrant(1, 1), {
        top: true,
        left: true
      });
    });

    it('top right', function () {
      assert.deepEqual(window._quadrant(99, 1), {
        top: true,
        left: false
      });
    });

    it('bottom left', function () {
      assert.deepEqual(window._quadrant(1, 99), {
        top: false,
        left: true
      });
    });

    it('bottom right', function () {
      assert.deepEqual(window._quadrant(99, 99), {
        top: false,
        left: false
      });
    });

  });

  describe('.resize', function () {
    var start  = 100;
    var change = 20;

    beforeEach(function () {
      window.setPosition(start, start);
      window.setSize(start, start);
    });

    afterEach(function () {
      window.endChange();
    });

    describe('left', function () {

      beforeEach(function () {
        window.startResize(start, 0);
      });

      it('in', function () {
        window.update(start - change, 0);
        assert.equal(window.x, start - change);
        assert.equal(window.width, start + change);
      });

      it('out', function () {
        window.update(start + change, 0);
        assert.equal(window.x, start + change);
        assert.equal(window.width, start - change);
      });
    });

    describe('top', function () {

      beforeEach(function () {
        window.startResize(0, start);
      });

      it('in', function () {
        window.update(0, start - change);
        assert.equal(window.y, start - change);
        assert.equal(window.height, start + change);
      });

      it('out', function () {
        window.update(0, start + change);
        assert.equal(window.y, start + change);
        assert.equal(window.height, start - change);
      });
    });

    describe('right', function () {

      beforeEach(function () {
        window.startResize(start * 2, 0);
      });

      it('in', function () {
        window.update(start * 2 - change, 0);
        assert.equal(window.x, start);
        assert.equal(window.width, start - change);
      });

      it('out', function () {
        window.update(start * 2 + change, 0);
        assert.equal(window.x, start);
        assert.equal(window.width, start + change);
      });
    });

    describe('bottom', function () {

      beforeEach(function () {
        window.startResize(0, start * 2);
      });

      it('in', function () {
        window.update(0, start * 2 - change);
        assert.equal(window.y, start);
        assert.equal(window.height, start - change);
      });

      it('out', function () {
        window.update(0, start * 2 + change);
        assert.equal(window.y, start);
        assert.equal(window.height, start + change);
      });
    });

  });

  describe('.open', function () {
  });

  describe('.close', function () {

    it('should close the window', function () {
      var window = new Window({ id: 0 });
      assert.equal(window.isOpen, true);

      window.close();
      assert.equal(window.isOpen, false);
    });

  });

  describe('.rename', function () {

    it('should rename the window', function () {
      var window = new Window({ id: 0 });
      assert.equal(window.title, '');

      var title = 'My custom window title';

      window.rename(title);
      assert.equal(window.title, title);
    });

  });

  describe('.toJSON', function () {

    it('should export to a standard JS object', function () {
      var props = {
        id: 'window-1',
        x: 20,
        y: 30,
        index: 1,
        width: 200,
        height: 400,
        maxWidth: Infinity,
        minWidth: 0,
        maxHeight: Infinity,
        minHeight: 0,
        title: 'Test',
        isOpen: true
      };

      var window = new Window(props);
      assert.deepEqual(window.toJSON(), props);
    });

  });

  describe('.onChange', function () {

    var window, spy;

    beforeEach(function () {
      window = new Window({ id: 0 });
      spy = sinon.spy();
      window.on('change', spy);
    });

    it('should trigger on setSize', function () {
      window.setSize();
      assert(spy.calledOnce);
    });

    it('should trigger on setPosition', function () {
      window.setPosition();
      assert(spy.calledOnce);
    });

    it('should trigger on move', function () {
      window.startMove();
      window.update(0, 0);
      window.endChange();
      assert(spy.calledOnce);
    });

    it('should trigger on resize', function () {
      window.startResize(0, 0);
      window.update(0, 0);
      window.endChange();
      assert(spy.calledOnce);
    });

    it('should trigger on open', function () {
      window.open();
      assert(! spy.called);
      window.close();
      assert(spy.calledOnce);
      window.open();
      assert(spy.called);
    });

    it('should trigger on close', function () {
      window.close();
      assert(spy.calledOnce);
      window.close();
      assert(spy.calledOnce);
    });

    it('should trigger on rename', function () {
      window.rename('new name');
      assert(spy.calledOnce);
    });

  });

});
