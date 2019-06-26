import Controller from '@ember/controller';
// import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    toastr: service('toast'),
    media: service(),

    init() {
        this._super(...arguments);
        this.message = [];
    },

    actions: {
        async register() {
            if(!this.model.username || !this.model.email || !this.model.password || !this.secondPassword) {
                this.toastr.error("Please fill in all fields", "Error");
            } else {
                if (this.model.password !== this.secondPassword) {
                    this.toastr.error("Password don't match", "Error");
                } else {
                    try {
                        await this.model.save()
                          .then(doc => {
                              if (doc) {
                                  this.toastr.success("Successfully added user", "Congratulations");
                                  this.transitionToRoute('/login');
                              }
                          })
                          .catch(e => {
                              console.log(e);
                              this.toastr.success("Successfully added user", "Congratulations");
                              this.transitionToRoute('/login');
                          })

                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
});
