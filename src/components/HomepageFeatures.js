import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    // title: 'Less is more',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    // description: (
    //   <>
    //     大道至简
    //   </>
    // ),
  },
  {
    // title: 'CoCo',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    // description: (
    //   <>
    //     志当存高远<br/>
    //     开发优秀开源项目，发起成立CoCo Project
    //   </>
    // ),
  },
  {
    // title: 'Easy to use, hard to err',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    // description: (
    //   <>
    //     易于使用，难于犯错
    //   </>
    // ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
