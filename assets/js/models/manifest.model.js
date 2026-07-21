export class Manifest {

    constructor(data = {}) {

        this.contentVersion = data.contentVersion ?? 1;

        this.minimumAppVersion = data.minimumAppVersion ?? 1;

        this.latestAppVersion = data.latestAppVersion ?? 1;

        this.modules = data.modules ?? {};

    }

}