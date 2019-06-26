/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { set } from '@ember/object';
import mathjs from 'mathjs';
import { inject as service } from '@ember/service';

export default Controller.extend({

    toastr: service('toast'),
    media: service(),

    setup(model) {
        model.forEach(doc => {
            set(doc, 'formatDate', []);
            let dates = doc.dates;
            dates.forEach(d => {
                let f = new Date(d);
                let a = f.getMonth();
                doc.formatDate.pushObject(a);
            });

            set(this, "chartData", {
                labels: doc.formatDate,
                datasets: [
                    {
                        label: "Weight-Progress -  Numbers stand for month",
                        backgroundColor: "rgba(54,162,235,0.2)",
                        borderColor: "rgba(54,162,235,0.8)",
                        data: doc.weights
                    }
                ]
            });

            if (doc.bmi > 40) {
                set(this, 'bmiValue', 'Heavily Overweight!')
                set(this, 'color', 'red');
            } 
            else if (doc.bmi < 40 && doc.bmi >= 31) {
                set(this, 'bmiValue', 'Adipositas');
                set(this, 'color', 'orange');
            }
            else if (doc.bmi < 31 && doc.bmi >= 25) {
                set(this, 'bmiValue', 'Overweight!');
                set(this)
            }
            else if(doc.bmi < 25 && doc.bmi >= 20) {
                set(this, 'bmiValue', 'Normal weight');
                set(this, 'color', 'green');
            }
            else if (doc.bmi < 20) {
                set(this, 'bmiValue', 'Underweight');
                set(this, 'color', 'orange');
            }
        });
    },

    bmiValue: '',
    color: '',

    chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            label: "Weight-Progress",
            backgroundColor: "rgba(54,162,235,0.2)",
            borderColor: "rgba(54,162,235,0.8)",
            data: []
          }
        ]
    },

    lineOptions: { // ADDED
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                }
            }]
        }
    },

    newWeight: "",
    
    actions: {
        addNewWeight() {
            if(this.newWeight !== "" || NaN(this.newWeight) !== true) {
                this.model.forEach(async doc => {
                    doc.weights.pushObject(parseInt(this.newWeight));
                    let date = Date.now();
                    doc.dates.pushObject(date);
                    this.toastr.success('Successfully added new weight', 'Success');
                    set(this, 'newWeight', '');
                    await doc.save();
                    let f = new Date(date);
                    let a = f.getMonth();
                    doc.formatDate.pushObject(a);
                    set(this, "chartData", {
                        labels: doc.formatDate,
                        datasets: [
                            {
                                label: "Weight-Progress -  Numbers stand for month",
                                backgroundColor: "rgba(54,162,235,0.2)",
                                borderColor: "rgba(54,162,235,0.8)",
                                data: doc.weights
                            }
                        ]
                    });
                    if(doc.unit === 'metric') {
                        let m = mathjs.evaluate(`${doc.height} cm to m`);
                        let bminum = Math.round(mathjs.evaluate(`${this.currentWeight} / ${m.value} ^ 2`))
                        set(doc, 'bmi', bminum);
                    } else {
                        let bminum = Math.round(mathjs.evaluate(`${this.currentWeight} / ${doc.height} ^ 2 * 703`))
                        set(doc, 'bmi', bminum);
                    }
                });
            }else {
                this.toastr.error('Please enter valid number', 'Error');
            }
        }
    }

    
});
