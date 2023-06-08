declare module "reactjs-image-resizer" {
  interface IReactResizer {
    className?: any;
    label?: string;
    uploadBtnText?: string;
    selectBtnText?: string;
    heightText?: string;
    widthText?: string;
    downloadText?: string;
    selectButtonStyle?: any;
    resizeButtonStyle?: any;
    downloadButtonStyle?: any;
    rotateEnabled?: boolean;
    clearEnabled?: boolean;
    Image?: any;
  }
  const ReactResizer: (props: IReactResizer) => JSX.Element;
}
