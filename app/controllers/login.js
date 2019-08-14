import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default Controller.extend({
  media: service(),
  session: service(),
  toastr: service('toast'),
  activeLoader: false,

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      set(this, 'activeLoader', true);
      this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
        set(this, 'activeLoader', false);
        this.toastr.error("Password or Email is wrong", "Error");
        console.log(reason)
      });
      this.toastr.success('You are logged in', 'Have fun');
    }
  }
});