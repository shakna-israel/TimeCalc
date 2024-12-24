document.addEventListener('deviceready', onDeviceReady, false);

var operators = ['+', '-', '*', '/', '^', 'REMOVE'];

var periods = ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
var period_calc = [
    604800000,
    86400000,
    3600000,
    60000,
    1000,
    1,
];

function recalculate() {
    var result = 0;

    // Calculate
    for(var i = 0; i < periods.length; i++) {
        var period = periods[i];
        var multiplier = period_calc[i];

        var els = document.getElementsByClassName(period);
        Array.prototype.forEach.call(els, function(item, index) {
            Array.prototype.forEach.call(item.children, function(el, discard) {
                if(!!el.value) {
                    // Get the operator here...
                    if(el.dataset.op == '+') {
                        result += (parseInt(el.value) * multiplier);
                    } else
                    if(el.dataset.op == '-') {
                        result -= (parseInt(el.value) * multiplier);
                    } else
                    if(el.dataset.op == '*') {
                        result *= (parseInt(el.value) * multiplier);
                    } else
                    if(el.dataset.op == '/') {
                        result /= (parseInt(el.value) * multiplier);
                    } else
                    if(el.dataset.op == '^') {
                        result ^= (parseInt(el.value) * multiplier);
                    }
                }
            });
        });
    }

    var check = result;
    var builder = [];
    for(var i = 0; i < periods.length; i++) {
        var period = periods[i];
        var multiplier = period_calc[i];

        var item = Math.floor(check / multiplier);

        builder.push(item);
        builder.push(period);

        check -= item * multiplier;
    }

    // Install into all .result els
    Array.prototype.forEach.call(document.getElementsByClassName('result'), function(field, index) {
        field.textContent = builder.join(' ');
    });
}

function add_field(root) {
    var row = document.createElement('div');
    row.classList.add('row');

    var check_mods = [];

    for(const name of periods) {
        var wrap_el = document.createElement('div');
        wrap_el.classList.add('col');
        wrap_el.classList.add(name);

        var input_el = document.createElement('input');
        input_el.setAttribute('type', 'number');
        input_el.setAttribute('min', '0');
        input_el.setAttribute('step', '1');
        input_el.setAttribute('placeholder', name);
        input_el.dataset.op = operators[0];

        input_el.addEventListener('change', function(evt) {
            recalculate();
        });

        check_mods.push(input_el);
        wrap_el.appendChild(input_el);

        row.appendChild(wrap_el);
    }

    var operator = document.createElement('select');
    var wrap_el = document.createElement('div');
    wrap_el.classList.add('col');
    for(const op of operators) {
        var tmp_el = document.createElement('option');
        tmp_el.setAttribute('value', op);
        tmp_el.textContent = op;
        operator.appendChild(tmp_el);
    }
    operator.addEventListener('change', function(evt) {
        if(evt.target.value == 'REMOVE') {
            for(var i = 0; i < check_mods.length; i++) {
                try {
                    check_mods[i].parentElement.removeChild(check_mods[i]);
                } catch(e) {}
            }
            recalculate();
            return;
        }

        for(var i = 0; i < check_mods.length; i++) {
            check_mods[i].dataset.op = evt.target.value;
        }
        recalculate();
    });

    wrap_el.appendChild(operator);
    row.appendChild(wrap_el);

    root.appendChild(row);

    recalculate();
}

function init() {
    var el = document.createElement('div');
    el.id = 'root';

    var result = document.createElement('p');
    result.classList.add('result');
    result.textContent = '0';
    el.appendChild(result);

    var div = document.createElement('div');

    var row = document.createElement('div');
    row.classList.add('row');
    for(const name of ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'operator']) {
        var wrap_el = document.createElement('div');
        wrap_el.classList.add('col');
        wrap_el.classList.add('legend');
        
        var tmp_el = document.createElement('span');
        tmp_el.textContent = name;
        wrap_el.appendChild(tmp_el);

        var kill_el = document.createElement('button');
        kill_el.textContent = 'X';
        kill_el.dataset.target = name;
        kill_el.addEventListener('click', function(evt) {
            // Kill all columns of this class:
            var els = document.getElementsByClassName(evt.target.dataset.target);
            Array.prototype.forEach.call(els, function(item, index) {
                item.parentElement.removeChild(item);
            });

            evt.target.parentElement.parentElement.removeChild(evt.target.parentElement);
        });
        wrap_el.appendChild(kill_el)

        row.appendChild(wrap_el);
    }
    div.appendChild(row);

    add_field(div);

    el.appendChild(div);

    el.appendChild(document.createElement('br'));
    var tmp_op = document.createElement('button');
    tmp_op.textContent = 'Add row';
    tmp_op.addEventListener('click', function(evt) {
        add_field(div);
        evt.target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    });
    el.appendChild(tmp_op);

    el.appendChild(document.createElement('br'));

    var result = document.createElement('p');
    result.classList.add('result');
    result.textContent = '0';
    el.appendChild(result);

    document.getElementById('root').replaceWith(el);
}

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    document.getElementById('deviceready').classList.add('ready');

    init();
}
