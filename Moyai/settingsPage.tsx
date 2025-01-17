import { React, ReactNative, Forms } from "aliucord/metro";

const { View, Text, Slider } = ReactNative;
import { Settings } from "aliucord/api/Settings";
import { MoyaiSettings } from ".";
import getStyles from "./styles";

const { FormSection, FormRow, FormLabel, FormSwitch, FormInput } = Forms;

// same code but official useSettings explodes for some reason.
function useSettings<T>(settings: Settings<T>) {
  const [, update] = React.useState(0);
  return React.useMemo(
    () => ({
      get<K extends keyof T, V extends T[K]>(key: K, defaultValue: V) {
        return settings.get(key, defaultValue);
      },
      set<K extends keyof T, V extends T[K]>(key: K, value: V) {
        settings.set(key, value);
        update((x) => x + 1);
      },
    }),
    []
  );
}

export default function page({
  _settings,
  onChange,
}: {
  _settings: Settings<MoyaiSettings>;
  onChange: () => any;
}) {
  const styles = getStyles();

  const settings = useSettings(_settings);
  const vol = settings.get("volume", 0.5);
  const newMsgLimit = settings.get("newMessageLimit", 10);

  return (
    <View style={styles.container}>
      <FormSection title="Moyai">
        <FormRow
          label={<Text style={styles.text}>Ignore bots</Text>}
          trailing={
            <FormSwitch
              value={settings.get("ignoreBots", true)}
              onValueChange={(v) => {
                settings.set("ignoreBots", v);
                onChange();
              }}
            />
          }
        />
        <FormRow
          label={
            <Text style={styles.text}>
              Trigger the 🗿 even when the app is unfocused
            </Text>
          }
          trailing={
            <FormSwitch
              value={settings.get("triggerWhenUnfocused", false)}
              onValueChange={(v) => {
                settings.set("triggerWhenUnfocused", v);
                onChange();
              }}
            />
          }
        />
        <FormRow
          label={<Text style={styles.text}>Volume</Text>}
          trailing={
            <>
              <Text style={styles.text}>{vol * 100}%</Text>
              <Slider
                style={styles.slider}
                value={vol}
                onSlidingComplete={(v) => {
                  settings.set("volume", v);
                  onChange();
                }}
              />
            </>
          }
        />
        <FormRow
          label={
            <Text style={styles.text}>
              Max vine booms triggered by new messages
            </Text>
          }
          trailing={
            <FormInput
              title="Count"
              value={newMsgLimit.toString()}
              onChange={(v) => {
                let newValue = parseInt(v);
                if (isNaN(newValue) || newValue < 1) {
                  newValue = newMsgLimit;
                }
                settings.set("newMessageLimit", newValue);
                onChange();
              }}
            />
          }
        />
      </FormSection>
    </View>
  );
}
