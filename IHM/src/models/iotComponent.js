export class IotComponent {
    id;
    name;
    idComponent;
    statut = "Connected";
    value;

    constructor(name, idComponent) {
        this.name = name;
        this.idComponent = idComponent;
    }
}