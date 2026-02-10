export default function createMarkerElement({
  color,
  label,
  variant = "default",
  selected = false,
}) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "oc-marker";

  if (variant === "special") el.classList.add("oc-marker--special");
  if (selected) el.classList.add("is-selected");

  if (color) el.style.setProperty("--marker-color", color);

  if (label) {
    el.setAttribute("aria-label", label);
  } else {
    el.setAttribute("aria-label", "marker");
  }

  const halo = document.createElement("span");
  halo.className = "oc-marker__halo";

  const core = document.createElement("span");
  core.className = "oc-marker__core";

  const stem = document.createElement("span");
  stem.className = "oc-marker__stem";

  const labelEl = document.createElement("span");
  labelEl.className = "oc-marker__label";
  labelEl.textContent = label ?? "";

  el.append(halo, core, stem, labelEl);

  return el;
}
