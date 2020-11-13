/** @jsx canva.create */

import { CanvaApiClient } from "@canva/editing-extensions-api-typings";
import { Button, Group } from "@canva/editing-extensions-api-typings/lib/jsx";

export const renderControls = (canva: CanvaApiClient) => {
  const controls = [
    <Group id="group1" label="Group #1" key="group1">
      <Button id="button1" label="Button #1" key="button1" />
      <Button id="button2" label="Button #2" key="button2" />
      <Button id="button3" label="Button #3" key="button3" />
    </Group>,
  ];
  canva.updateControlPanel(controls);
};