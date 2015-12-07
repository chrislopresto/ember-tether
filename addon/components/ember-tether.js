import Ember from 'ember';
import TransitionModule from 'ember-tether/modules/transition-module';

const { observer, get, run, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['ember-tether'],
  classPrefix: 'ember-tether',
  target: null,
  attachment: null,
  targetAttachment: null,
  offset: null,
  targetOffset: null,
  targetModifier: null,
  constraints: null,
  optimizations: null,

  didInsertElement() {
    this.addTether();
    this._super(...arguments);
  },

  willDestroyElement() {
    const { _tether, element } = this;
    run.schedule('render', () => {
      this.removeElement(element);
      this.removeTether(_tether);
    });
    this._super(...arguments);
  },

  tetherDidChange: observer(
    'classPrefix',
    'target',
    'attachment',
    'targetAttachment',
    'offset',
    'targetOffset',
    'targetModifier',
    'constraints',
    'optimizations',
    function() {
      this.removeTether(this._tether);
      this.addTether();
    }
  ),

  addTether() {
    if (get(this, '_tetherTarget')) {
      Tether.modules.push(TransitionModule);
      this._tether = new Tether(this._tetherOptions());
    }
  },

  removeTether(tether) {
    if (tether) {
      tether.destroy();
    }
  },

  removeElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  _tetherTarget: computed('target', function() {
    let t = get(this, 'target');
    if (t && t.element) {
      t = t.element;
    }
    return t;
  }),

  _tetherOptions() {
    let options = {
      element: this.element,
      target: get(this, '_tetherTarget')
    };
    [ 'classPrefix',
      'attachment',
      'targetAttachment',
      'offset',
      'targetOffset',
      'targetModifier',
      'constraints',
      'optimizations'
    ].forEach((k) => {
      const v = get(this, k);
      if (!Ember.isNone(v)) {
        options[k] = v;
      }
    });
    return options;
  }
});
