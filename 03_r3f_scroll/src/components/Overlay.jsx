import { Scroll } from "@react-three/drei";

const Section = ({ title, describtion, align = "left" }) => {
  return (
    <div
      className="h-screen w-screen px-20 flex items-center"
      style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg">
        <h1 className="font-bold text-3xl mb-2 text-[#b67fb6]">{title}</h1>
        <p>{describtion}</p>
      </div>
    </div>
  );
};

function Overlay() {
  return (
    <Scroll html>
      <Section
        title="SectionA"
        describtion="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
      />
      <Section
        align="right"
        title="SectionB"
        describtion="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
      />
      <Section
        title="SectionC"
        describtion="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
      />
    </Scroll>
  );
}

export default Overlay;
