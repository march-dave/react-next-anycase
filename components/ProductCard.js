export default function ProductCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Premium Titanium Cutting Board</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Crafted from pure titanium with a 1.5 mm thickness for a smooth surface that won't dull knives.</li>
        <li>Non-porous material resists food juices and odors from garlic or onions.</li>
        <li>Lightweight at under 0.86 pounds, ideal for camping and travel.</li>
        <li>Sleek titanium finish with an easy-grip handle for comfortable use.</li>
        <li>Easy to clean with water or in the dishwasher.</li>
      </ul>
    </div>
  );
}
