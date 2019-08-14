import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
    session: service(),

    async model() {
        const Person = await this.store.findAll('person');
        return Person;
    }
});
