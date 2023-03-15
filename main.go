package main

import (
	"context"
	"fmt"
	"time"

	"github.com/momentohq/client-sdk-go/auth"
	"github.com/momentohq/client-sdk-go/config"
	"github.com/momentohq/client-sdk-go/momento"
)

const (
	cacheName = "mycache" //this must be an existing cache in your account.
	topicName = "test-topic"
)

func main() {
	// Initialization
	topicClient := getTopicClient()
	ctx := context.Background()

	// Instantiate subscriber to an existing cache.
	sub, err := topicClient.Subscribe(ctx, &momento.TopicSubscribeRequest{
		CacheName: cacheName,
		TopicName: topicName,
	})
	if err != nil {
		panic(err)
	}

	// Receive and print messages in a goroutine in this async function call
	go func() { pollForMessages(ctx, sub) }()
	time.Sleep(time.Second)

	// Publish messages for the subscriber
	publishMessages(topicClient, ctx)
}

func pollForMessages(ctx context.Context, sub momento.TopicSubscription) {
	for {
		item, err := sub.Item(ctx)
		if err != nil {
			panic(err)
		}
		fmt.Printf("received message: '%v'\n", item)
	}
}

func getTopicClient() momento.TopicClient {
	credProvider, err := auth.NewEnvMomentoTokenProvider("MOMENTO_AUTH_TOKEN")
	if err != nil {
		panic(err)
	}
	topicClient, err := momento.NewTopicClient(
		config.LaptopLatest(),
		credProvider,
	)
	if err != nil {
		panic(err)
	}
	return topicClient
}

func publishMessages(client momento.TopicClient, ctx context.Context) {
	for i := 0; i < 10; i++ {
		fmt.Printf("publishing message %d\n", i)
		_, err := client.Publish(ctx, &momento.TopicPublishRequest{
			CacheName: cacheName,
			TopicName: topicName,
			Value:     momento.String(fmt.Sprintf("hello %d", i)),
		})
		if err != nil {
			panic(err)
		}
		time.Sleep(time.Second)
	}
}
