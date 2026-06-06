"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

type Settings = {
  applicationsEnabled: boolean;

  applicationDisabledMessage: string;

  cardFee: number;

  cardValidityYears: number;
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<Settings>({
      applicationsEnabled: true,

      applicationDisabledMessage:
        "",

      cardFee: 100,

      cardValidityYears: 5,
    });

  const [loading, setLoading] =
    useState(true);

  const fetchSettings =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/admin/settings"
          );

        setSettings(
          res.data.settings
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings =
    async () => {
      try {
        await axios.patch(
          "/api/admin/settings",
          settings
        );

        toast.success(
          "Settings saved successfully"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to save settings"
        );
      }
    };

  if (loading) {
    return (
      <div>
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Manage SmartRide platform
          settings
        </p>
      </div>

      <div className="border rounded-xl p-6 space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold">
              Accept Applications
            </h3>

            <p className="text-sm text-muted-foreground">
              Enable or disable
              new applications
            </p>
          </div>

          <Switch
            checked={
              settings.applicationsEnabled
            }
            onCheckedChange={(
              checked
            ) =>
              setSettings({
                ...settings,
                applicationsEnabled:
                  checked,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label>
            Disabled Message
          </label>

          <Input
            value={
              settings.applicationDisabledMessage
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                applicationDisabledMessage:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label>
            Card Fee (₹)
          </label>

          <Input
            type="number"
            value={
              settings.cardFee
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                cardFee:
                  Number(
                    e.target.value
                  ),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label>
            Card Validity (Years)
          </label>

          <Input
            type="number"
            value={
              settings.cardValidityYears
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                cardValidityYears:
                  Number(
                    e.target.value
                  ),
              })
            }
          />
        </div>

        <Button
          onClick={
            saveSettings
          }
        >
          Save Settings
        </Button>

      </div>

    </div>
  );
}