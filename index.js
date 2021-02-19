const MinifrdgFormValidator = (app, validators) => {
  validators = validators || {
    required: (elem) => elem.value,
    invalid: (elem) => false,
    confirm: (elem) => elem.value === app.$('.next input[name=' + elem.name.replace('Confirm', '') + ']').value,
    password: (elem) => (/[A-Z]/.test(elem.value) && /[a-z]/.test(elem.value) && /[^0-9^a-z]/i.test(elem.value) && elem.value.length > 7),
    email: (elem) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(elem.value)
  }
  const validate = (selector, shouldThrow) => {
    const form = app.$(selector);
    const output = {};
    let truth = true;
    const errors = [];
    truth = Array.from(form.elements).reduce((truth, elem) => {
      if(elem.name) {
        const localTruth = true;
        output[elem.name] = elem.value;
        if(elem.type==='number') output[elem.value] = +elem.value;
        elem.getAttributeNames().forEach(name => {
          if(validators[name]) {
            elem.className = elem.className.replace(/\s*invalid|\s*valid/g, '');
            const validatorTruth = validators[name](elem);
            localTruth = localTruth && validatorTruth;
            if(!validatorTruth) {
              errors.push({name: elem.name + '-' + name, dirty:elem.dirty});
              if(elem.dirty) elem.className += ' invalid';
              output[elem.name] = null;
            }
            else {
              if(elem.dirty) elem.className += ' valid';
            }
          }
        });
        truth = truth && localTruth;
      }
      return truth;
    }, true);
    app.$$('.error').forEach(elem => elem.className = elem.className.replace(/ *invalid/g, ''));
    if(truth) form.className = form.className.replace(/ *invalid/g, '');
    else {
      form.className = form.className.replace(/ *invalid/g, '') + ' invalid';
      errors.forEach(error => {
        const elem = app.$('.error.' + error.name);
        if(elem && (shouldThrow || error.dirty)) elem.className += ' invalid';
        if(shouldThrow) throw('invalid');
      })
    };
    return output;
  };
  const init = (selector) => {
    const fprm = app.$(selector);
    form.elements.forEach(elem => {
      if(elem.name) {
        elem.onchange = (ev) => {
          ev.srcElement.dirty = true;
          validate(selector);
        };
        elem.onkeyup = (ev) => validate(selector);
      }
    });
    validate(selector);
  }
  app.validator = {init, validate};
};
(typeof(module)!=='undefined') && (module.exports = MinifrdgFormValidator) || (window.MinifrdgFormValidator = MinifrdgFormValidator)