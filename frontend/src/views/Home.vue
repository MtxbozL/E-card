<template>
  <div class="profile-hero">
    <!-- 左侧 -->
    <div class="profile-left">
      <div class="avatar-box">
        <span class="logo-mark">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#23283B"/>
            <path d="M12 14C12 11.7909 13.7909 10 16 10H24C26.2091 10 28 11.7909 28 14V26C28 28.2091 26.2091 30 24 30H16C13.7909 30 12 28.2091 12 26V14Z" fill="#FFD15C"/>
          </svg>
        </span>
        <img class="avatar" src="/static/touxiang.png" alt="头像" />
      </div>
      <div class="profile-name">嘉威<br />Oceankafty</div>
      <div class="yellow-underline"></div>
      <div class="profile-social">
        <a href="#" class="icon"><i class="fab fa-dribbble"></i></a>
        <a href="#" class="icon"><i class="fab fa-instagram"></i></a>
        <a href="#" class="icon"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="profile-right">
      <div class="profile-intro">
        <div class="intro-label">- 个人简介</div>
        <div class="intro-title">前端开发工程师，现居中国。</div>
        <div class="intro-desc">
          热爱编程，专注于前端技术，喜欢探索新技术和设计美学。拥有丰富的项目开发经验，致力于打造高质量的 Web 应用。
        </div>
        <a href="#" class="my-story-btn">我的故事 <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-hero {
  display: flex;
  align-items: center;
  min-height: 100vh; /* 改为最小高度 */
  width: 100%;
  background: #2d3146;
  position: relative;
  justify-content: center;
  padding: 100px 0 50px; /* 添加上下内边距 */
  box-sizing: border-box;
}

.profile-left {
  flex: 0 0 950px;
  position: relative;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 1vw;
  min-width: 0;
  transform: translate(-4vw, 0);
}

.avatar-box {
  position: relative;
  width: 560px;
  height: 560px;
  min-width: 240px;
  margin-bottom: 3rem;
  z-index: 1;
}

.logo-mark {
  position: absolute;
  left: -113px;
  top: -140px;
  display: block;
  z-index: 2;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 28px 70px 0 rgba(0,0,0,0.33);
  border-radius: 0;
  display: block;
}

.profile-name {
  position: static;
  left: auto;
  bottom: auto;
  margin-bottom: 0.7rem;
  font-size: 4.1rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 3px 18px rgba(0,0,0,0.22), 0 0 2px #23283B;
  z-index: 2;
  line-height: 1.1;
  letter-spacing: -1.7px;
  text-align: left;
  padding-left: 8px;
}

.yellow-underline {
  width: 78px;
  height: 9px;
  background: #FFD15C;
  border-radius: 4px;
  margin-bottom: 3rem;
  margin-left: 12px;
}

.profile-social {
  display: flex;
  gap: 1.9rem;
  margin-top: 1.5rem;
  margin-left: 12px;
}

.icon {
  color: #fff;
  font-size: 2rem;
  opacity: 0.8;
  transition: color 0.2s, opacity 0.2s;
}

.icon:hover {
  color: #FFD15C;
  opacity: 1;
}

.profile-right {
  flex: 0 0 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-right: 4vw;
  min-width: 0;
  height: auto;
}

.profile-intro {
  max-width: 800px;
  margin-top: 0;
  text-align: left;
}

.intro-label {
  color: #bfc3d4;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.intro-title {
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  line-height: 1.3;
  color: #fff;
}

.intro-desc {
  color: #bfc3d4;
  font-size: 2rem;
  margin-bottom: 3.5rem;
  line-height: 1.7;
}

.my-story-btn {
  display: inline-flex;
  align-items: center;
  color: #FFD15C;
  font-weight: 600;
  font-size: 2.2rem;
  text-decoration: none;
  gap: 1.2rem;
  transition: color 0.2s;
}

.my-story-btn:hover {
  color: #fff;
}

@media (max-width: 1600px) {
  .profile-left, .profile-right { flex-basis: 100%; }
  .avatar-box { width: 340px; height: 340px; }
  .profile-name { font-size: 1.9rem; left: auto; bottom: auto; padding-left: 8px; }
  .profile-intro { max-width: 90vw; }
  .intro-label, .intro-desc, .intro-title, .my-story-btn { font-size: 1.2rem !important; }
  .profile-left { transform: translate(-2vw, 2vh); }
  .logo-mark { left: -93px; top: -156px; }
}

@media (max-width: 900px) {
  .profile-hero {
    flex-direction: column;
    min-height: 100vh;
    justify-content: flex-start;
    padding: 80px 0 30px; /* 调整移动端内边距 */
  }
  .profile-left, .profile-right {
    padding: 0 1rem;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .profile-left {
    align-items: center;
    padding-bottom: 1rem;
    padding-top: 1rem;
    transform: none;
  }
  .avatar-box { margin-left: 0; }
  .profile-right { padding-right: 0; align-items: center; }
  .profile-intro { margin-top: 20px; text-align: center; }
  .logo-mark { left: 0; top: 0; }
}

@media (max-width: 600px) {
  .profile-hero {
    padding: 70px 0 20px; /* 小屏幕设备内边距 */
  }
  .profile-name { font-size: 1.1rem; left: auto; bottom: auto; padding-left: 4px; }
  .avatar-box { width: 200px; height: 200px; } /* 增大头像尺寸 */
  .profile-left, .profile-right { flex-basis: 100%; }
}
</style>