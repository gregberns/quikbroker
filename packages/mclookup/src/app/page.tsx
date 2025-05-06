import { Button, Card, Container } from '@quikbroker/ui-components';

export default function HomePage() {
  return (
    <main>
      <Container>
        <div className="py-12">
          <h1 className="text-4xl font-bold mb-6 text-center">MC Lookup Tool</h1>
          <Card className="max-w-lg mx-auto">
            <Card.Header>
              <Card.Title>Find Carrier Information</Card.Title>
              <Card.Description>
                Enter an MC number to look up carrier information
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="mb-4">
                <label htmlFor="mc-number" className="block text-sm font-medium mb-1">
                  MC Number
                </label>
                <input
                  id="mc-number"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter MC number"
                />
              </div>
            </Card.Content>
            <Card.Footer>
              <Button>Look Up</Button>
            </Card.Footer>
          </Card>
        </div>
      </Container>
    </main>
  );
}