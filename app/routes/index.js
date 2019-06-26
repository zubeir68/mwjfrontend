import Route from '@ember/routing/route';

export default Route.extend({
    beforeModel(/* transition */) {
        this.replaceWith('login'); // Implicitly aborts the on-going transition.
    }
});
