import Route from '@ember/routing/route';

export default Route.extend({
    beforeModel(/* transition */) {
        this.replaceWith('dashboard'); // Implicitly aborts the on-going transition.
    }
});
