import { toast } from 'vue3-toastify';


export class toastComponent {

    static errorMessages(message) {
        toast(message, {
            autoClose: 3000,
            type: "error",
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    static successMessages(message) {
        toast(message, {
            autoClose: 3000,
            type: "success",
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    static infoMessages(message) {
        toast(message, {
            autoClose: 3000,
            type: "info",
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    static warningMessages(message) {
        toast(message, {
            autoClose: 3000,
            type: "warning",
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    static defaultMessages(message) {
        toast(message, {
            autoClose: 3000,
            type: "default",
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    static loadingMessages(message) {
        toast(message, {
            autoClose: 3000,
            type: "loading",
            position: toast.POSITION.TOP_RIGHT,
        });
    }

}