import { Card, Heading, ResizePanel } from '../../components';

const CardExample = () => {
  return (
    <>
      <Heading variation="h4">Card</Heading>
      <ResizePanel>
        <Card>this is dummy text</Card>
      </ResizePanel>
    </>
  );
};

export default CardExample;
