(function () {
  let template = document.createElement("template");
  template.innerHTML = `
      <style>
        :host {}
      </style>
      <div>
        <p>Current Conversion Rate: <span id="conversionRate"></span></p>
      </div>
    `;

  class CurrencyWidget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({
        mode: "open"
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }

    async connectedCallback() {
      this.updateConversionRate();
      this.interval = setInterval(() => {
        this.updateConversionRate();
      }, 4000);
    }

    disconnectedCallback() {
      clearInterval(this.interval);
    }

    async updateConversionRate() {
	const http = require("https");
	const url = 'https://api.openai.com/v1/completions';
	const options = {
    		method: 'POST',
    		'Content-Type': 'application/json',
    		'Authorization': 'Bearer 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',
	};

	const data = `{
  		"model": "text-davinci-003",
  		"prompt": "COME TI CHIAMI?",
  		"temperature": 0,
  		"max_tokens": 100,
		"top_p": 1,
  		"frequency_penalty": 0.0,
  		"presence_penalty": 0.0,
  		"stop": ["n"]
	}`;

	let result = '';
	const req = http.request(url, options, (res) => {
    		console.log(res.statusCode);
		res.setEncoding('utf8');
    		res.on('data', (chunk) => {
        	result += chunk;
    	});

    	res.on('end', () => {
        console.log(result);
    	});
	});

	req.on('error', (e) => {
    	console.error(e);
	});

	req.write(data);
	req.end();
	    
	    
	    
      /* const from = this._props.from || "USD";
      const to = this._props.to || "INR";
      const amount = this._props.amount || 1 ;
      const decimalPlaces = this._props.decimalPlaces || 2;

      const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
      const response = await fetch(url);
      const data = await response.json();

      const conversionRate = data.result.toFixed(decimalPlaces);
      const conversionRateElement = this.shadowRoot.getElementById("conversionRate");
      conversionRateElement.innerText = `${conversionRate} ${to}/${from}`;*/
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties
      };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      console.warn(changedProperties);
		}
  }

  customElements.define("com-rohitchouhan-currencywidget", CurrencyWidget);
})();
