import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { useEffect, useState } from "react";

const cld = new Cloudinary({
    cloud : {
        cloudName : import.meta.env.VITE_CLOUD_NAME
    }
})

function ProfilePicture({ publicId, size }) {
  const [id, setId] = useState(publicId)
  useEffect(() => {
    if(!publicId || publicId === ""){
      setId("IMG_2979_turdeu")
    }
    else {
      setId(publicId)
    }
  }, [publicId])
  const image = cld.image(id)
  .resize(fill().width(200).height(200).gravity(autoGravity()))
  .delivery(format("auto"))
  .delivery(quality("auto"));
  return (
    <img
      src={image.toURL()}
      alt="Profile picture"
      width={size}
      height={size}
      style={{ borderRadius: "50%", objectFit: "cover" }}
    />
  );
}

export default ProfilePicture