/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CanvasPreview } from "./CanvasPreview";
import image from "../assets/cloud-computing.png";
import SidebarItem from "./SidebarItem";
import Slider from "./Slider";

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue Rotate",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20,
    },
    unit: "px",
  },
];

const ImageCropper = () => {
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const selectedOption = options[selectedOptionIndex];

  const [crop, setCrop] = useState({});
  useEffect(() => {
    if (img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(img);
    } else {
      setPreview(null);
    }
  }, [img]);
  const resetInputVale = () => {
    const id = document.getElementById("pictureInput");
    id.value = "";
  };
  function getImageStyle() {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return { filter: filters.join(" ") };
  }
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      CanvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  const handleDownload = () => {
    previewCanvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Croped-image.png";
      link.click();
    }, "image/*");
  };
  function handleSliderChange({ target }) {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: target.value };
      });
    });
  }

  return (
    <>
      {/* input */}
      <div
        style={{
          width: "30%",
          display: "flex",
          alignItems: "center",
          border: "1px dashed #ccc",
          padding: "50px",
          justifyContent: "center",
          margin: "auto",
          textAlign: "center",
        }}
        className=""
      >
        <input
          type="file"
          name=""
          id="pictureInput"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.type.substr(0, 5) === "image") {
              setImg(file);
            } else {
              alert("select an image file only!");
              setImg(null);
              resetInputVale();
              setCompletedCrop(null);
            }
          }}
        />
      </div>
      {/* main */}
      <div
        style={{
          display: "flex",
          padding: "50px 20px ",
          justifyContent: "space-between",
        }}
        className="main"
      >
        {/* actual image */}
        <div
          style={{
            width: "45%",
          }}
          className=""
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              ref={imgRef}
              style={{
                objectFit: "cover",
                width: "100%",
              }}
              src={preview ? preview : ""}
              alt=""
            />
          </ReactCrop>
        </div>
        {/* filters */}
        {completedCrop && (
          <div
            className="filters"
            style={{
              display: "flex",
              flexDirection: "column",
              // gap: "2px",
            }}
          >
            {options.map((option, index) => {
              return (
                <SidebarItem
                  key={index}
                  name={option.name}
                  active={index === selectedOptionIndex}
                  handleClick={() => setSelectedOptionIndex(index)}
                />
              );
            })}
          </div>
        )}
        {/* preview */}
        {completedCrop && (
          <div
            style={{
              width: "36%",
            }}
          >
            {Boolean(completedCrop) && (
              <canvas
                ref={previewCanvasRef}
                className="preview"
                style={getImageStyle()}
              ></canvas>
            )}
            <div
              className=""
              style={{
                width: "100%",
                marginTop: "40px",
              }}
            >
              <Slider
                min={selectedOption.range.min}
                max={selectedOption.range.max}
                value={selectedOption.value}
                handleChange={handleSliderChange}
              />
            </div>
          </div>
        )}
      </div>

      {/** button **/}
      {completedCrop && (
        <div
          style={{
            width: "20%",
            margin: "0px auto 20px",
            display: "flex",
          }}
        >
          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              padding: "20px",
              background: "lightgreen",
              borderRadius: "20px",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            <img
              style={{
                width: "20px",
                height: "20px",
              }}
              src={image}
              alt=""
            />
            download
          </button>
        </div>
      )}
    </>
  );
};

export default ImageCropper;
