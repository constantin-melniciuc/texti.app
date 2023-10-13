import { action, makeObservable, observable, runInAction } from "mobx";

export class ToastService {
  message: string = "";
  type: "success" | "error" = "success";
  isVisible: boolean = false;
  timeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeObservable(this, {
      isVisible: observable,
      message: observable,
      type: observable,
      show: action,
      hide: action,
    });
  }

  show = (message: string, type: "success" | "error" = "error") => {
    this.message = message;
    this.type = type;
    this.isVisible = true;

    this.timeout = setTimeout(() => {
      runInAction(() => {
        this.isVisible = false;
      });
    }, 3000);
  };

  hide = () => {
    this.timeout !== null && clearTimeout(this.timeout);
    this.isVisible = false;
  };
}

const toastService = new ToastService();
export default toastService;
