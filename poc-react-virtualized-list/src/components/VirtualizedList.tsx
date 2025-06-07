import { useRef, useState, UIEvent } from "react";

const ITEM_HEIGHT = 35;
const VISIBLE_COUNT = 20;

const items = Array.from({ length: 10000 }, (_, i) => `Item #${i + 1}`);

export default function VirtualizedList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: `${ITEM_HEIGHT * VISIBLE_COUNT}px`,
        overflowY: "auto",
        border: "1px solid #ccc",
      }}
    >
      <div
        style={{
          height: `${items.length * ITEM_HEIGHT}px`,
          position: "relative",
        }}
      >
        {visibleItems.map((item, index) => {
          console.log("Rendering item:", item);
          return (
            <div
              key={startIndex + index}
              style={{
                position: "absolute",
                top: `${(startIndex + index) * ITEM_HEIGHT}px`,
                height: `${ITEM_HEIGHT}px`,
                lineHeight: `${ITEM_HEIGHT}px`,
                padding: "0 10px",
                borderBottom: "1px solid #eee",
              }}
            >
              {item}
            </div>
          );
        })}
        {/* {items.map((item) => (
          <div key={item} style={{ height: "35px" }}>
            {item}
          </div>
        ))} */}
      </div>
    </div>
  );
}
