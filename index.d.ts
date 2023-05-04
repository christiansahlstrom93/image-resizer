declare module "reactjs-image-resizer" {
  interface IReactResizer {
    className?: any;
    label?: string;
    uploadBtnText?: string;
    selectBtnText?: string;
    heightText?: string;
    widthText?: string;
    downloadText?: string;
  }
  const ReactResizer: (props: IReactResizer) => JSX.Element;
}
