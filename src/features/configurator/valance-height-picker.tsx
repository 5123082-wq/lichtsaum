import { VALANCE_HEIGHTS_MM } from "@/features/mini-configurator/constraints";
import { ConfiguratorPicker } from "@/features/configurator/configurator-picker";

const heightOptions = VALANCE_HEIGHTS_MM.map((height) => ({
  id: String(height),
  label: `${height} mm`
}));

export function ValanceHeightPicker({
  value,
  onChange
}: {
  value: number | "";
  onChange: (height: number) => void;
}) {
  return (
    <div className="configurator-select-field">
      <span>Volanthöhe</span>
      <ConfiguratorPicker
        ariaLabel={`Volanthöhe: ${value} mm`}
        id="configurator-height"
        kind="size"
        listboxLabel="Volanthöhe auswählen"
        onChange={(height) => onChange(Number(height))}
        options={heightOptions}
        value={String(value)}
      />
    </div>
  );
}
