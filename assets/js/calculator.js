var Calculator = {

  results_id:    'calculator-result',
  results_value: '0',
  memory_id:     'calculator-screen',
  memory_value:  '',
  history_id:    'calc-history-list',
  history_value: [],

  SUM:  ' + ',
  MIN:  ' - ',
  DIV:  ' / ',
  MULT: ' * ',
  PROC: '%',
  SIN:  'sin(',
  COS:  'cos(',
  MOD:  ' mod ',
  BRO:  '(',
  BRC:  ')',
  POW:  ' ** ',
  FACT: 'fact(',
  LOG: 'ln(',
  SQR: ' ** 2',
  CUBE: ' ** 3',
  EXP: 'exp(',
  PI: '𝜋',
  TAN: 'tan(',
  INV: 'inv(',

  calculate: function() {
    this.history_value.push(this.memory_value);
    this.results_value = this.engine.exec(this.memory_value);
    this.add_to_history();
    this.refresh();
  },

  inverse: function(n){
    return 1/n;
  },

  factorial : function(n){
      var res = 1;
      for (var i = 2; i <= n; i++)
        res = res * i;
      return res;
  },

  put: function(value) {
    this.memory_value += value;
    this.update_memory();
  },

  reset: function() {
    this.memory_value = '';
    this.results_value = '0';
    this.refresh();
  },

  reset_history: function() {
    this.memory_value = '';
    this.results_value = '0';
    this.clear_history();
    this.refresh();
  },

  refresh: function() {
    this.update_result();
    this.update_memory();
  },

  update_result: function() {
    document.getElementById(this.results_id).innerHTML = this.results_value;
  },

  update_memory: function() {
    document.getElementById(this.memory_id).innerHTML = this.memory_value;
  },

  add_to_history: function() {
    if (isNaN(this.results_value) == false) {
      var div = document.createElement('li');
      div.innerHTML = this.memory_value + ' = ' + this.results_value;

      var tag = document.getElementById(this.history_id);
      tag.insertBefore(div, tag.firstChild);
    }
  },

  

  clear_history: function(){
    $('#'+this.history_id+ '> li').remove();
  },

  

  engine: {
    exec: function(value) {
      try {return eval(this.parse(value))}
      catch (e) {return e}
    },

    parse: function(value) {
      if (value != null && value != '') {
        value = this.replaceFun(value, Calculator.PROC, '/100');
        value = this.replaceFun(value, Calculator.MOD, '%');
        value = this.replaceFun(value, 'fact', 'Calculator.factorial');
        value = this.replaceFun(value, 'inv', 'Calculator.inverse');
        value = this.replaceFun(value, 'ln', 'Math.log');
        value = this.replaceFun(value, 'exp', 'Math.exp');
        
        
        // value = this.replaceFun(value, 'inversesine', 'Math.asin');
        // value = this.replaceFun(value, 'inversecosine', 'Math.acos');
        value = this.replaceFun(value, 'sin', 'Math.sin');
        value = this.replaceFun(value, 'cos', 'Math.cos');
        value = this.replaceFun(value, 'tan', 'Math.tan');
        value = this.replaceFun(value, '𝜋', 'Math.PI');
        value = this.addSequence(value, Calculator.PROC);
        return value;
      }
      else return '0';
    },

    replaceFun: function(txt, reg, fun) {
      return txt.replace(new RegExp(reg, 'g'), fun);
    },

    addSequence: function(txt, fun) {
      var list = txt.split(fun);
      var line = '';

      for(var nr in list) {
        if (line != '') {
          line = '(' + line + ')' + fun + '(' + list[nr] + ')';
        } else {
          line = list[nr];
        }
      }
      return line;
    }
  }
}


$(document).keypress(function(e) {
  var element = $('*[data-key="'+e.which+'"]');

  var fun = function(element){
    // skip if this is no a functional button
    if (element.length == 0){ return true }

    if (element.data('constant') != undefined){
      return Calculator.put(Calculator[element.data('constant')]);
    }

    if (element.data('method') != undefined){
      return Calculator[element.data('method')]();
    }

    return Calculator.put(element.html());
  }

  if (fun(element) != false){
    return false
  } else {
    return true
  }
});

$(document).ready(function() {

  $(".btn").click(function(e) {
    e.preventDefault();

    if ($(this).data('constant') != undefined){
      return Calculator.put(Calculator[$(this).data('constant')]);
    }

    if ($(this).data('method') != undefined){
      return Calculator[$(this).data('method')]();
    }

    return Calculator.put($(this).html());
  });
});
