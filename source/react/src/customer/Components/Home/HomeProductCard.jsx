import React from "react";
import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Use the sectionPath if provided, otherwise fallback to the dynamic path detection
  const getProductPath = (product) => {
    // Use the section path from HomeProductSection if available
    if (product.sectionPath) {
      return product.sectionPath;
    }
    
    // Fallback to title-based detection if sectionPath not provided
    const title = (product.title || "").toLowerCase();
    
    if (title.includes("kurta") && title.includes("men")) {
      return "/men/clothing/mens_kurta";
    } else if (title.includes("kurta") && title.includes("women")) {
      return "/women/clothing/women_kurta";
    } else if (title.includes("saree")) {
      return "/women/clothing/saree";
    } else if (title.includes("dress")) {
      return "/women/clothing/dress";
    } else if (title.includes("goun") || title.includes("gown")) {
      return "/women/clothing/gown";
    } else if (title.includes("shoe") && title.includes("men")) {
      return "/men/footwear/mens_shoes";
    } else if (title.includes("lengha") || title.includes("choli")) {
      return "/women/clothing/lengha_choli";
    } else if (title.includes("pant") && title.includes("men")) {
      return "/men/clothing/mens_pants";
    }
    
    // Default case if no specific category identified
    return "/men/clothing/mens_kurta";
  };

  return (
    <div
      onClick={() => navigate(getProductPath(product))}
      className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[15rem] mx-3"
    >
      <div className="h-[13rem] w-[10rem]">
        <img
          className="object-cover object-top w-full h-full"
          src={product?.image || product?.imageUrl}
          alt={product?.title}
        />
      </div>

      <div className="p-4 ">
        <h3 className="text-lg font-medium text-gray-900">
          {product?.brand || product?.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{product?.title}</p>
      </div>
    </div>
  );
};

export default HomeProductCard;
