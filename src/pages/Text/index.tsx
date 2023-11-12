import reactElementToJSXString from 'react-element-to-jsx-string';
import { Heading, CodeBlock, Text, Tabs } from '@swagfinger/components';

const TextExample = () => {
  const preview = <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>;

  const previewString = reactElementToJSXString(preview);

  return (
    <>
      <Heading variation="h1" data-observable="true">
        Text
      </Heading>

      <Tabs>
        <Tabs.TriggerGroup>
          <Tabs.Trigger data-tab="0">PREVIEW</Tabs.Trigger>
          <Tabs.Trigger data-tab="1">CODE</Tabs.Trigger>
        </Tabs.TriggerGroup>

        <Tabs.Content data-tab="0">{preview}</Tabs.Content>
        <Tabs.Content data-tab="1">
          <CodeBlock>
            {`
  import { Text } from "@swagfinger/components";

  ${previewString}
  `}
          </CodeBlock>
        </Tabs.Content>
      </Tabs>
    </>
  );
};

export default TextExample;
