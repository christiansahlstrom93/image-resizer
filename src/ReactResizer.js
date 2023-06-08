import { useEffect, useState } from "react";
import rotateLeft from "./rotate-left.svg";
import rotateRight from "./rotate-right.svg";
import clear from "./clear.svg";
import "./styles.css";

const TWENTYFIVE_PERCENT = 25;
const FIFTY_PERCENT = 50;
const SEVENTYFIVE_PERCENT = 75;

export const ReactResizer = (props) => {
  const {
    className,
    label = "Resize image",
    uploadBtnText = "Resize",
    selectBtnText = "Select",
    heightText = "Height",
    widthText = "Width",
    downloadText = "Download",
    selectButtonStyle = {},
    resizeButtonStyle = {},
    downloadButtonStyle = {},
    rotateEnabled = true,
    clearEnabled = true,
    Image,
  } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [resized, setResized] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [totalRotation, setTotRotation] = useState(0);
  const [error, setError] = useState("");

  const base64ToBlob = (base64) => {
    const byteCharacters = window.atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray]);
  };

  useEffect(() => {
    return () => {
      if (resized) {
        URL.revokeObjectURL(resized);
      }
    };
  }, []);

  const image = (src, alt, className, style = {}, onClick = () => "") => {
    if (Image) {
      return (
        <Image
          src={src}
          alt={alt}
          className={className}
          style={style}
          onClick={onClick}
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onClick={onClick}
      />
    );
  };

  const clearForm = () => {
    setSelectedFile(null);
    setRotation(0);
    setError("");
    setTotRotation(0);
    setPreviewImg(null);
    setResized(null);
  };

  const onFileChoose = (event) => {
    const file = event.target.files[0];
    const tempUrl = URL.createObjectURL(file);
    setTotRotation(0);
    setRotation(0);
    setError("");
    const img = new Image();
    img.onload = () => {
      setSelectedFile({
        data: file,
        width: img.width,
        height: img.height,
      });
      setDimensions({ auto: 0, width: img.width, height: img.height });
      URL.revokeObjectURL(tempUrl);
      setResized(null);
      event.target.value = "";
    };

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => setPreviewImg(ev.target.result);

    img.src = tempUrl;
  };

  const onFileUpload = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", selectedFile.data, selectedFile.data.name);
    formData.append("width", dimensions.width);
    formData.append("height", dimensions.height);
    formData.append("rotate", totalRotation + rotation);
    try {
      const response = await fetch(`https://media.algobook.info/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResized(URL.createObjectURL(base64ToBlob(data.base64)));
      setTotRotation(totalRotation + rotation);
    } catch (err) {
      setResized(null);
      setError(
        "Resize failed. Please check that everything is filled in correctly."
      );
    } finally {
      setLoading(false);
      setRotation(0);
    }
  };

  const onWidthChange = (newWidth) => {
    setDimensions({
      ...dimensions,
      auto: 0,
      width: newWidth,
    });
  };

  const onHeightChange = (newHeight) => {
    setDimensions({
      ...dimensions,
      auto: 0,
      height: newHeight,
    });
  };

  const onRadioClicked = (value) => {
    const percentage = (num, per) => {
      const sub = (num / 100) * per;
      return Number((num - sub).toFixed(0));
    };

    setDimensions({
      ...dimensions,
      auto: value,
      width: percentage(selectedFile.width, value),
      height: percentage(selectedFile.height, value),
    });
  };

  const onRotationClick = (left) => {
    if (left) {
      if (rotation === 0) {
        setRotation(270);
      } else {
        setRotation(rotation - 90);
      }
    } else {
      if (rotation === 360) {
        setRotation(90);
      } else {
        setRotation(rotation + 90);
      }
    }
  };

  const renderControls = () => {
    if (!selectedFile) {
      return null;
    }

    return (
      <div className="controls">
        <span className="selectedName">{selectedFile.data.name}</span>
        <div className="inputs">
          <div className="radios">
            <div className="radioLabel">
              <input
                checked={dimensions.auto === TWENTYFIVE_PERCENT}
                className="radio"
                id="25"
                type="radio"
                style={{ height: "24px", width: "24px" }}
                onChange={() => onRadioClicked(TWENTYFIVE_PERCENT)}
              />
              <span className="radioText">25%</span>
            </div>
            <div className="radioLabel">
              <input
                checked={dimensions.auto === FIFTY_PERCENT}
                className="radio"
                id="50"
                type="radio"
                style={{ height: "24px", width: "24px" }}
                onChange={() => onRadioClicked(FIFTY_PERCENT)}
              />
              <span className="radioText">50%</span>
            </div>
            <div className="radioLabel">
              <input
                checked={dimensions.auto === SEVENTYFIVE_PERCENT}
                className="radio"
                id="75"
                type="radio"
                style={{ height: "24px", width: "24px" }}
                onChange={() => onRadioClicked(SEVENTYFIVE_PERCENT)}
              />
              <span className="radioText">75%</span>
            </div>
          </div>
          <div className="inputWrapper">
            <div className="inputControl">
              <span className="dimensionLabel">{widthText}</span>
              <input
                className="sizeInput"
                type="number"
                pattern="[0-9]*"
                value={dimensions.width}
                onChange={(ev) => onWidthChange(ev.currentTarget.value)}
              />
              <span className="pxLabel">px</span>
            </div>
            <div className="inputControl">
              <span className="dimensionLabel">{heightText}</span>
              <input
                className="sizeInput"
                type="number"
                pattern="[0-9]*"
                value={dimensions.height}
                onChange={(ev) => onHeightChange(ev.currentTarget.value)}
              />
              <span className="pxLabel">px</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderImg = () => {
    if (loading) {
      return null;
    }

    const translateRotation = () => {
      if (rotation === 0) {
        return 0;
      } else if (rotation === 90) {
        return 270;
      } else if (rotation === 270) {
        return 90;
      }

      return rotation;
    };

    const renderPreview = (imgSrc) => {
      const translatedDegree = translateRotation();

      return (
        <div className="previewContainer_Algobook">
          <img
            className="previewImg_Algobook"
            alt="preview"
            src={imgSrc}
            style={{
              transform: `rotate(${translatedDegree}deg)`,
            }}
          />
          {rotateEnabled ? (
            <div className="rotateContainer">
              {image(rotateLeft, "preview", "rotateImg", {}, () =>
                onRotationClick(false)
              )}
              {image(rotateRight, "preview", "rotateImg", {}, () =>
                onRotationClick(true)
              )}
            </div>
          ) : null}
        </div>
      );
    };

    if (!resized && previewImg) {
      return renderPreview(previewImg);
    }

    if (!resized) {
      return null;
    }

    return renderPreview(resized);
  };

  return (
    <div className={`reactResize ${className}`}>
      <div className="algobook_resize_headline">
        <h3 className="headline">{label}</h3>
        {selectedFile && clearEnabled
          ? image(clear, "clear", "algobook_clear_img", {}, clearForm)
          : null}
      </div>
      {renderControls()}
      {renderImg()}
      {loading ? (
        <div className="loadingContainer">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : null}

      <div className={`buttonContainer ${!selectedFile ? "margin" : ""}`}>
        <label
          className="selectButton"
          htmlFor="fileInput"
          style={selectButtonStyle}
        >
          {selectBtnText}
          <input
            id="fileInput"
            className="fileInput"
            onChange={onFileChoose}
            type="file"
            accept="image/png, image/jpg, image/jpeg"
          />
        </label>
        <button
          style={resizeButtonStyle}
          className={
            !selectedFile || loading ? "uploadButtonDisabled" : "uploadButton"
          }
          disabled={!selectedFile}
          onClick={onFileUpload}
        >
          {uploadBtnText}
        </button>
        {resized && !loading ? (
          <a
            style={downloadButtonStyle}
            className="downloadButton"
            href={resized}
            download={`resized_${selectedFile?.data?.name}`}
          >
            {downloadText}
          </a>
        ) : null}
      </div>
      {error ? (
        <div className="error">
          <span>{error}</span>
        </div>
      ) : null}
      <div className="powered">
        <a
          href="https://algobook.info/"
          className="link"
          target="_blank"
          rel="noreferrer"
        >
          Powered by Algobook
        </a>
      </div>
    </div>
  );
};
