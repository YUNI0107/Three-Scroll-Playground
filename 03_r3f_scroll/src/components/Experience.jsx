import { OrbitControls, ScrollControls } from "@react-three/drei";
import Office from "./Office";
import Overlay from "./Overlay";

function Experience() {
  return (
    <>
      <ambientLight intensity={1} />
      <OrbitControls enableZoom={false} />

      <ScrollControls pages={3} damging={0.25}>
        <Office />
        <Overlay />
      </ScrollControls>
    </>
  );
}

export default Experience;
