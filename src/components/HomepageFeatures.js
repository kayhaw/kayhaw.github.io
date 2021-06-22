import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Cooperation(合作)',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        The way to achieve coherence<br/>
        达成一致的方式
      </>
    ),
  },
  {
    title: 'CoCo',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        志当存高远<br/>
        开发优秀开源项目，发起成立CoCo Project
      </>
    ),
  },
  {
    title: 'Coherence(一致)',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        The target of cooperation<br/>
        团队合作的目标
      </>
    ),
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
