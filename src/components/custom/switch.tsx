import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function CustomSwitch({ register, label, error, ...props }: any) {
    const { isRequired = false, ...restProps } = props;
  return (
    <div className="w-[400px]">
      <span className="pb-1 text-gray-500">
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </span>
      <div className="flex items-center space-x-2 ">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Active?</Label>
      </div>
    </div>
  );
}
