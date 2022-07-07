import "./App.css";
import ImageCropper from "./components/ImageCropper";

function App() {
  return (
    <div className="">
      <h2
        style={{
          textAlign: "center",
        }}
      >
        Edit Your Dream!!!
      </h2>
      <div
        style={{
          // border: "1px dashed lightgray",
          boxShadow: "1px 1px 10px lightgray",
          borderRadius: "10px",
          margin: "50px",
          marginTop: "20px",
          paddingTop: "20px",
        }}
      >
        <ImageCropper />
      </div>
    </div>
  );
}

export default App;
