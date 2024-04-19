
import React from 'react';
import { List, Card } from 'antd';



const ActivitiesList = () => {

    const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    id: i,
    title: `Item ${i + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus lobortis sodales. Mauris in arcu mi. Integer sodales arcu eros, non dictum orci efficitur vel. Duis eget nunc felis. Duis sit amet aliquam libero. Duis quis urna eu sapien rutrum tincidunt. Proin auctor non lectus non lacinia. Nulla a eros lorem. Integer vel velit sapien.'
  });
}

  return (

    <Card>
    <List
      itemLayout="vertical"
      size="large"
      dataSource={data}
      renderItem={item => (
        <List.Item
          key={item.id}
          extra={
            <img
              width={100}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          }
        >
          <List.Item.Meta
            title={<a href={`#${item.id}`}> {item.title}</a>}
            description={item.description}
          />
        </List.Item>
      )}
    />

   </Card>
  );
};

export default ActivitiesList;